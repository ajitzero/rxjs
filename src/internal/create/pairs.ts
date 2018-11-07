import { Observable } from "../Observable";
import { sourceAsObservable } from "../util/sourceAsObservable";
import { FOType, Sink } from "../types";
import { Subscription } from "../Subscription";

/**
 * Convert an object into an Observable of `[key, value]` pairs.
 *
 * <span class="informal">Turn entries of an object into a stream.</span>
 *
 * <img src="./img/pairs.png" width="100%">
 *
 * `pairs` takes an arbitrary object and returns an Observable that emits arrays. Each
 * emitted array has exactly two elements - the first is a key from the object
 * and the second is a value corresponding to that key. Keys are extracted from
 * an object via `Object.keys` function, which means that they will be only
 * enumerable keys that are present on an object directly - not ones inherited
 * via prototype chain.
 *
 * By default these arrays are emitted synchronously. To change that you can
 * pass a {@link SchedulerLike} as a second argument to `pairs`.
 *
 * @example <caption>Converts a javascript object to an Observable</caption>
 * ```javascript
 * const obj = {
 *   foo: 42,
 *   bar: 56,
 *   baz: 78
 * };
 *
 * pairs(obj)
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('the end!')
 * );
 *
 * // Logs:
 * // ["foo", 42],
 * // ["bar", 56],
 * // ["baz", 78],
 * // "the end!"
 * ```
 *
 * @param {Object} obj The object to inspect and turn into an
 * Observable sequence.
 * @returns {(Observable<Array<string|T>>)} An observable sequence of
 * [key, value] pairs from the object.
 */
export function pairs<T>(obj: Object): Observable<[string, T]> {
  return sourceAsObservable((type: FOType.SUBSCRIBE, sink: Sink<[string, T]>, subs: Subscription) => {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length && !subs.closed; i++) {
      const key = keys[i];
      if (obj.hasOwnProperty(key)) {
        sink(FOType.NEXT, [key, obj[key]], subs);
      }
    }
    sink(FOType.COMPLETE, undefined, subs);
  });
}