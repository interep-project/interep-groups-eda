import { faker } from '@faker-js/faker'

export const randomTwitterIds = ({
  size = 50,
  usedIds = [],
}: {
  size?: number
  usedIds?: string[]
} = {}) => {
  const ids: string[] = []

  while (ids.length < size) {
    const id = faker.random.numeric(faker.datatype.number({ max: 19, min: 1 }))

    if (!usedIds.includes(id) && !ids.includes(id) && id !== '') {
      ids.push(id)
    }
  }

  return ids
}
