/**
 * Returns a new dualbounced function that invokes `func` with the oldest
 * `oldValue` and newest `newValue`, `wait` milliseconds after the last
 * invocation.
 *
 * @export
 * @template TNew The type of the newest-kept value.
 * @template TOld The type of the oldest-kept value.
 * @template TReturn The type of the returned value.
 * @param {(newValue: TNew, oldValue: TOld) => TReturn} func The function to
 * dualbounce.
 * @param {number} wait The number of milliseconds to wait.
 * @returns {(newValue: TNew, oldValue: TOld) => Promise<TReturn>} A
 * dualbounced function. During the same wait period, it will return the same
 * promise. After `wait` milliseconds have passed since the last invocation,
 * the promise will resolve with the result of `func`.
 */
export default function dualbounce<TNew, TOld, TReturn>(
    func: (newValue: TNew, oldValue: TOld) => TReturn,
    wait: number
): (newValue: TNew, oldValue: TOld) => Promise<TReturn> {
    let activePromise: Promise<TReturn> | null = null;
    let activePromiseResolve:
        | ((value?: TReturn | PromiseLike<TReturn>) => void)
        | null = null;
    let initialValue: TOld;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (newValue, oldValue): Promise<TReturn> => {
        if (!activePromise) {
            activePromise = new Promise(
                resolve => (activePromiseResolve = resolve)
            );
            initialValue = oldValue;
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            activePromiseResolve?.(func(newValue, initialValue));
            activePromise = null;
        }, wait);

        return activePromise;
    };
}
