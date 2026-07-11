import { describe, expect, it } from 'vitest'
import { buildDiscoverParams } from '../api/tmdb'
import type { MovieFilters } from '../types/tmdb'

const emptyFilters: MovieFilters = { genreIds: [], yearFrom: null, yearTo: null, minRating: null }

describe('buildDiscoverParams', () => {
  it('includes only the base params when no filters are set', () => {
    const params = buildDiscoverParams(emptyFilters)

    expect(params).toEqual({
      sort_by: 'popularity.desc',
      page: '1',
      include_adult: 'false',
      language: 'en-US',
    })
  })

  it('OR-joins multiple genre ids with a pipe, not a comma', () => {
    const params = buildDiscoverParams({ ...emptyFilters, genreIds: [28, 35] })

    expect(params.with_genres).toBe('28|35')
  })

  it('maps a year range to primary_release_date.gte/lte as full zero-padded dates', () => {
    const params = buildDiscoverParams({ ...emptyFilters, yearFrom: 2015, yearTo: 2024 })

    expect(params['primary_release_date.gte']).toBe('2015-01-01')
    expect(params['primary_release_date.lte']).toBe('2024-12-31')
  })

  it('supports an open-ended year range (only one bound set)', () => {
    const params = buildDiscoverParams({ ...emptyFilters, yearFrom: 2020 })

    expect(params['primary_release_date.gte']).toBe('2020-01-01')
    expect(params['primary_release_date.lte']).toBeUndefined()
  })

  it('maps minRating to vote_average.gte', () => {
    const params = buildDiscoverParams({ ...emptyFilters, minRating: 7.5 })

    expect(params['vote_average.gte']).toBe('7.5')
  })

  it('treats a minRating of 0 as "no minimum" rather than sending an explicit filter', () => {
    const params = buildDiscoverParams({ ...emptyFilters, minRating: 0 })

    expect(params['vote_average.gte']).toBeUndefined()
  })

  it('combines genre, year range, and rating filters together', () => {
    const params = buildDiscoverParams({ genreIds: [28, 12], yearFrom: 2015, yearTo: 2024, minRating: 6 })

    expect(params).toMatchObject({
      with_genres: '28|12',
      'primary_release_date.gte': '2015-01-01',
      'primary_release_date.lte': '2024-12-31',
      'vote_average.gte': '6',
    })
  })
})
