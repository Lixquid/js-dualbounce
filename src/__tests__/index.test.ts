import dualbounce from "..";

const sleep = (time: number): Promise<void> =>
    new Promise(ok => setTimeout(ok, time));

it("should execute on a single invocation", async () => {
    let result: unknown[] | undefined = undefined;
    const fn = dualbounce((n, o) => (result = [n, o]), 100);
    fn(1, 2);
    await sleep(200);
    expect(result).toEqual([1, 2]);
});
it("should return on a single invocation", async () => {
    const fn = dualbounce((n, o) => [n, o], 100);
    expect(await fn(1, 2)).toEqual([1, 2]);
});
it("should invoke with the oldest and newset values", async () => {
    const fn = dualbounce((n, o) => [n, o], 100);
    fn(1, 0);
    fn(2, 1);
    fn(3, 2);
    expect(await fn(4, 3)).toEqual([4, 0]);
});
it("should invoke the provided function only once per wait period", async () => {
    const mock = jest.fn((n, o) => [n, o]);
    const fn = dualbounce(mock, 100);
    fn(1, 0);
    fn(2, 1);
    await fn(3, 2);
    expect(mock).toBeCalledTimes(1);
});
it("should return the same promise once per wait period", async () => {
    const fn = dualbounce((n, o) => [n, o], 100);
    const p1 = fn(1, 0);
    const p2 = fn(2, 1);
    const p3 = fn(3, 1);
    expect(p1).toBe(p2);
    expect(p2).toBe(p3);
});
it("should return different values once the wait period has expired", async () => {
    const fn = dualbounce((n, o) => [n, o], 100);
    fn("new", "old");
    await fn("newer", "new");
    fn("new2", "old2");
    expect(await fn("newer2", "new2")).toEqual(["newer2", "old2"]);
});
it("should allow returning async values", async () => {
    const fn = dualbounce(
        (n, o) =>
            new Promise(ok => {
                setTimeout(() => ok([n, o]), 100);
            }),
        100
    );
    fn(1, 0);
    fn(2, 1);
    expect(await fn(3, 2)).toEqual([3, 0]);
});
