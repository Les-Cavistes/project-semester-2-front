/**
 * This action is used to debounce input events on an HTML element.
 * It delays the execution of a callback function until after a specified delay.
 *
 * Example usage:
 * ```svelte
 * <script lang="ts">
 *   import {debounce} from './path/to/debounce';
 *
 *   let inputValue = '';
 *
 *   function handleInput(value: string) {
 *     console.log('Input value:', value);
 *   }
 * </script>
 *
 * <input type="text" bind:value={inputValue} use:debounce={{ delay: 500, callback: handleInput }} />
 * ```
 */

export type TDebounceParams = {
  delay?: number;
  // The callback function to be executed after the delay.
  // It takes the input value as a parameter.
  callback: (value: string) => void;
};

/**
 * Debounce action for input elements.
 *
 * @param node {HTMLElement} The input element to attach the action to.
 * @param params {{ delay?: number, callback: (value: string) => void }} The parameters for the action.
 */
export const debounce = (node: HTMLElement, params: TDebounceParams) => {
  const delay = params.delay ?? 300;
  let timeoutId: ReturnType<typeof setTimeout>;

  const handleInput = (event: Event) => {
    clearTimeout(timeoutId);
    const target = event.target as HTMLInputElement;

    timeoutId = setTimeout(() => {
      params.callback(target.value);
    }, delay);
  };

  node.addEventListener("input", handleInput);

  return {
    destroy() {
      clearTimeout(timeoutId);

      node.removeEventListener("input", handleInput);
    },
  };
};
