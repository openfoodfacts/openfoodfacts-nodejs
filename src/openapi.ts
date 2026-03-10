export function formData(
  data: Record<string, string | Blob | undefined> | undefined,
): FormData {
  const form = new FormData();
  const entries = Object.entries(data ?? {});
  for (const [key, value] of entries) {
    if (value == null) continue;
    form.append(key, value);
  }
  return form;
}
