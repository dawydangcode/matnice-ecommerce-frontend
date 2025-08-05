// Debug API response errors
// Add this to lens.service.ts updateLensThickness method for debugging

console.log('Update request URL:', `/api/v1/lens-thickness/${id}/update`);
console.log('Update request data:', data);

try {
const response = await apiService.put<LensThickness>(
`/api/v1/lens-thickness/${id}/update`,
data
);
return response;
} catch (error: any) {
console.error("Error updating lens thickness:", error);
console.error("Response data:", error.response?.data);
console.error("Response status:", error.response?.status);
console.error("Response headers:", error.response?.headers);
throw error;
}
