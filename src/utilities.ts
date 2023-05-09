export const create = <K extends keyof HTMLElementTagNameMap>(
  name: K,
  attributes: Partial<HTMLElementTagNameMap[K]> = {}
) => {
  return Object.assign(document.createElement(name), attributes)
}

export const append =
  <T extends Element>(...elements: T[]) =>
  (parent: HTMLElement = document.body) => {
    parent.append(...elements)
  }
