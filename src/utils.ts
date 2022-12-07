import { faker } from '@faker-js/faker'

export const randomTwitterIds = ({
  size = 50,
  used = [],
}: {
  size?: number
  used?: string[]
} = {}) => {
  const ids: string[] = []

  while (ids.length < size) {
    const id = faker.random.numeric(faker.datatype.number({ max: 19, min: 1 }))

    if (!used.includes(id) && !ids.includes(id) && id !== '') {
      ids.push(id)
    }
  }

  return ids
}
