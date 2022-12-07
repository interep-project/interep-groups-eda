import { faker } from '@faker-js/faker'

import { randomTwitterIds } from '../src/utils'

describe('Utils', () => {
  describe('randomTwitterIds', () => {
    it('creates a list of 50 number strings by default', () => {
      const ids = randomTwitterIds()

      expect(ids).toHaveLength(50)
      ids.forEach((id) => {
        expect(id).toMatch(/[0-9]+/)
      })
    })

    it('excludes a list of used ids', () => {
      jest.spyOn(faker.random, 'numeric').mockImplementationOnce(() => '10')

      const ids = randomTwitterIds({ used: ['10'] })

      expect(faker.random.numeric).toHaveNthReturnedWith(1, '10')
      expect(ids.includes('10')).toBeFalsy()
    })
  })
})
