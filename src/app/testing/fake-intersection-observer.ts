// The test browser (jsdom) has no IntersectionObserver, so tests use this fake one.
export class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  constructor(private readonly callback: (entries: { isIntersecting: boolean }[]) => void) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(): void {}

  disconnect(): void {}

  static showOnScreen(): void {
    const last = FakeIntersectionObserver.instances.at(-1);
    last?.callback([{ isIntersecting: true }]);
  }
}
