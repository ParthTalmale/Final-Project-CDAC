package com.backend.config;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class RazorpaySignatureUtil {
	
//	public static boolean verify(String orderId,String paymentId,String signature,String secret)  throws Exception {
//		String payload = orderId + "|" + paymentId;
//		Mac mac = Mac.getInstance("HmacSHA256");
//		mac.init(new SecretKeySpec(secret.getBytes(),"HmacSHA256"));
//		
//		byte[] digest = mac.doFinal(payload.getBytes());
//		
//		String generatedSignature = Base64.getEncoder().encodeToString(digest);
//		
//		return generatedSignature.equals(signature);
//		
//		
//	}
	
	
	public static boolean verify(String orderId,
            String paymentId,
            String signature,
            String secret) throws Exception {

String payload = orderId + "|" + paymentId;

Mac mac = Mac.getInstance("HmacSHA256");
mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));

byte[] digest = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

String generatedSignature = bytesToHex(digest);

return generatedSignature.equals(signature);
}

private static String bytesToHex(byte[] bytes) {
StringBuilder hex = new StringBuilder(bytes.length * 2);
for (byte b : bytes) {
hex.append(String.format("%02x", b));
}
return hex.toString();
}

}
