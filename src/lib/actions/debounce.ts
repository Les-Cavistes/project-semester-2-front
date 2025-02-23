export const debounce = (node: HTMLElement, params: { delay?: number, callback: (value: string) => void }) => {
  const delay = params.delay ?? 300;
  let timeoutId: ReturnType<typeof setTimeout>;

  const handleInput = (event: Event) => {
    clearTimeout(timeoutId);
    const target = event.target as HTMLInputElement;

    timeoutId = setTimeout(() => {
      params.callback(target.value);
    }, delay);
  };

  node.addEventListener('input', handleInput);

  return {
    destroy() {
      clearTimeout(timeoutId);
      node.removeEventListener('input', handleInput);
    }
  };
}