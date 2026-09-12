export function useToast() {
  const toast = ({ title, description, variant }: { title?: string; description?: string; variant?: string }) => {
    if (typeof window !== "undefined") {
      if (variant === "destructive") {
        console.error(`[Toast Error] ${title}: ${description}`);
      } else {
        console.log(`[Toast] ${title}: ${description}`);
      }
    }
  };

  return { toast };
}
