import { describe, expect, it } from 'vitest'
import { sortMovies } from '../utils/sortMovies'
import type { Movie } from '../types/tmdb'

function makeMovie(overrides: Partial<Movie>): Movie {
  return {
    id: 1,
    title: 'Untitled',
    poster_path: null,
    overview: '',
    vote_average: 0,
    release_date: '',
    genre_ids: [],
    popularity: 0,
    ...overrides,
  }
}

describe('sortMovies', () => {
  it('sorts by rating descending without mutating the input array', () => {
    const input = [
      makeMovie({ id: 1, title: 'Low', vote_average: 4 }),
      makeMovie({ id: 2, title: 'High', vote_average: 9 }),
      makeMovie({ id: 3, title: 'Mid', vote_average: 6 }),
    ]
    const inputCopy = [...input]

    const sorted = sortMovies(input, 'vote_average', 'desc')

    expect(sorted.map((m) => m.title)).toEqual(['High', 'Mid', 'Low'])
    expect(input).toEqual(inputCopy)
  })

  it('sorts by title ascending case-insensitively', () => {
    const input = [
      makeMovie({ id: 1, title: 'banana' }),
      makeMovie({ id: 2, title: 'Apple' }),
      makeMovie({ id: 3, title: 'cherry' }),
    ]

    const sorted = sortMovies(input, 'title', 'asc')

    expect(sorted.map((m) => m.title)).toEqual(['Apple', 'banana', 'cherry'])
  })

  it('always sorts undated movies last, regardless of direction', () => {
    const input = [
      makeMovie({ id: 1, title: 'Undated', release_date: '' }),
      makeMovie({ id: 2, title: 'Old', release_date: '1990-01-01' }),
      makeMovie({ id: 3, title: 'New', release_date: '2020-01-01' }),
    ]

    const desc = sortMovies(input, 'release_date', 'desc')
    expect(desc.map((m) => m.title)).toEqual(['New', 'Old', 'Undated'])

    const asc = sortMovies(input, 'release_date', 'asc')
    expect(asc.map((m) => m.title)).toEqual(['Old', 'New', 'Undated'])
  })
})
