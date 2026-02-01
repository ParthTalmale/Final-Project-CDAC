# Interview Prep: Kubernetes vs. Docker Compose 🎓

**Question:** *"Why did you use Docker Compose? Why not Kubernetes?"*

**Short Answer:** *"Kubernetes is overkill for a single-server deployment. Docker Compose handles the multi-container orchestration I need (DB + Backend + Frontend) perfectly efficiently on one machine without the massive resource overhead of a K8s cluster."*

---

## 1. The Core Difference
*   **Docker Compose** is a **Project Manager**. It says: "Hey single computer, run these 3 containers please." It works on **ONE machine**.
*   **Kubernetes** is a **Fleet Commander**. It says: "I have 50 computers (nodes). I need to run 10,000 containers. You go here, you go there. If Computer A dies, move everything to Computer B instantly."

## 2. Why K8s is Overkill for THIS Project
1.  **Complexity**: K8s requires setting up a "Cluster" (Control Plane, Nodes, Pods, Services, Ingress). Docker Compose is just **one file** (`docker-compose.yml`).
2.  **Resource Cost**: K8s itself (just running the system) uses 1-2GB of RAM. Your EC2 instance might crash just trying to run K8s control plane, leaving no RAM for your actual app. Docker Compose uses almost 0 extra RAM.
3.  **The "Interviewer Trap"**: If you use K8s for a simple project, a smart interviewer will ask: *"Why did you assume the complexity of K8s for a simple 3-container app?"*
    *   **Bad Answer:** "Because it's popular."
    *   **Good Answer (Yours):** "I chose Docker Compose because it's the right tool for single-server deployment. K8s introduces orchestration complexity that solves problems I don't have yet (like multi-node scaling)."

## 3. When SHOULD you use Kubernetes?
You use K8s when you cross these lines:
*   **Zero-Downtime Updates:** You need to update the backend code *without* the user noticing a 1-second blip. (K8s rolls updates one by one).
*   **Auto-scaling:** It's Black Friday. You typically run 2 Backends, but suddenly you need 50. K8s does this automatically.
*   **Self-Healing across Servers:** If the entire EC2 instance catches fire, K8s notices and restarts your app on a *different* EC2 instance automatically.

## Summary Recommendation to tell Interviewer
**"I containerized the app using Docker so it's ready for Kubernetes in the future, but used Docker Compose for deployment now to keep infrastructure costs and complexity low."**

That is a Senior Engineer answer. 🏆
