import { useEffect, useState, useCallback } from "react";
import { Card, Button, Badge, Container, Row, Col, Alert, Modal, Form, Spinner } from "react-bootstrap";
import { FiPhone, FiMail, FiMapPin, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  fetchEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact
} from "../../services/patientApi";
import useAuth from "../../hooks/useAuth";

/**
 * Emergency Contacts Component
 * 
 * Displays and manages patient's emergency contacts.
 * Integrates with backend API for CRUD operations.
 * 
 * @author MediConnect Team
 */
export default function EmergencyContacts() {
  const { patientId } = useAuth();

  // State management
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    phone: "",
    altPhone: "",
    email: "",
    address: "",
    primaryContact: false
  });
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch emergency contacts from API
   */
  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEmergencyContacts();
      setContacts(data || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to load emergency contacts. Please try again.");
      // Keep existing contacts if refresh fails
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Open modal for adding new contact
   */
  const handleAddContact = () => {
    setEditingContact(null);
    setFormData({
      name: "",
      relation: "",
      phone: "",
      altPhone: "",
      email: "",
      address: "",
      primaryContact: false
    });
    setShowModal(true);
  };

  /**
   * Open modal for editing existing contact
   */
  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name || "",
      relation: contact.relation || contact.relationship || "", // Support both for safety during migration if needed
      phone: contact.phone || "",
      altPhone: contact.altPhone || "",
      email: contact.email || "",
      address: contact.address || "",
      primaryContact: contact.primaryContact || contact.primary || false
    });
    setShowModal(true);
  };

  /**
   * Submit form (add or update)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingContact) {
        // Update existing contact
        await updateEmergencyContact(editingContact.id, formData);
        toast.success("Contact updated successfully");
      } else {
        // Add new contact
        await addEmergencyContact(formData);
        toast.success("Contact added successfully");
      }

      setShowModal(false);
      loadContacts(); // Refresh list
    } catch (err) {
      console.error("Error saving contact:", err);
      toast.error(editingContact ? "Failed to update contact" : "Failed to add contact");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Delete a contact
   */
  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await deleteEmergencyContact(contactId);
      toast.success("Contact deleted successfully");
      setContacts(prev => prev.filter(c => c.id !== contactId));
    } catch (err) {
      console.error("Error deleting contact:", err);
      toast.error("Failed to delete contact");
    }
  };

  /**
   * Set a contact as primary
   */
  const handleSetPrimary = async (contact) => {
    try {
      await updateEmergencyContact(contact.id, { ...contact, primaryContact: true });
      toast.success("Primary contact updated");
      loadContacts();
    } catch (err) {
      console.error("Error setting primary contact:", err);
      toast.error("Failed to update primary contact");
    }
  };

  // Find primary contact
  const primaryContact = contacts.find(c => c.primaryContact);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2>Emergency Contacts</h2>
          <p className="text-muted">
            Manage your emergency contact information for medical situations
          </p>
        </div>

        <Button variant="dark" onClick={handleAddContact}>
          <FiPlus className="me-1" /> Add Contact
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mt-3" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading contacts...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && contacts.length === 0 && (
        <Alert variant="info" className="mt-3">
          <Alert.Heading>No Emergency Contacts</Alert.Heading>
          <p>
            You haven't added any emergency contacts yet. Emergency contacts are important
            for medical situations when healthcare providers need to reach your family.
          </p>
          <Button variant="primary" onClick={handleAddContact}>
            Add Your First Contact
          </Button>
        </Alert>
      )}

      {/* PRIMARY BANNER */}
      {!loading && primaryContact && (
        <Alert variant="warning" className="mt-3">
          <strong>Primary Emergency Contact</strong><br />
          {primaryContact.name} ({primaryContact.relation}) - {primaryContact.phone}
        </Alert>
      )}

      {/* CONTACT CARDS */}
      {!loading && contacts.map(contact => (
        <Card key={contact.id} className="mt-3 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={8}>
                <h5 className="fw-bold">
                  {contact.name}{" "}
                  <Badge bg="secondary">{contact.relation}</Badge>{" "}
                  {contact.primaryContact && <Badge bg="warning" text="dark">Primary</Badge>}
                </h5>

                <div className="mt-2 text-muted">
                  <p><FiPhone className="me-2" /> {contact.phone}</p>

                  {contact.altPhone && (
                    <p>
                      <FiPhone className="me-2" /> {contact.altPhone}
                      <Badge bg="light" text="dark" className="ms-2">Alternate</Badge>
                    </p>
                  )}

                  {contact.email && (
                    <p><FiMail className="me-2" /> {contact.email}</p>
                  )}

                  {contact.address && (
                    <p><FiMapPin className="me-2" /> {contact.address}</p>
                  )}
                </div>
              </Col>

              <Col className="d-flex justify-content-end align-items-start gap-2">
                {!contact.primaryContact && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleSetPrimary(contact)}
                  >
                    Set Primary
                  </Button>
                )}

                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => handleEditContact(contact)}
                >
                  <FiEdit2 /> Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  <FiTrash2 /> Delete
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingContact ? "Edit Contact" : "Add Emergency Contact"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Relationship <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="relation"
                value={formData.relation}
                onChange={handleInputChange}
                required
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Alternate Phone</Form.Label>
              <Form.Control
                type="tel"
                name="altPhone"
                value={formData.altPhone}
                onChange={handleInputChange}
                placeholder="Enter alternate phone"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="emergency-primary-contact-check" // Unique ID
                name="primaryContact"
                checked={!!formData.primaryContact}
                onChange={() => setFormData(prev => ({ ...prev, primaryContact: !prev.primaryContact }))}
                label="Set as primary emergency contact"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="dark" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  Saving...
                </>
              ) : (
                editingContact ? "Update Contact" : "Add Contact"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
