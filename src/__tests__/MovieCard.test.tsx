import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MovieCard } from '../components/MovieCard'
import type { Movie } from '../types/tmdb'

const movie: Movie = {
  id: 42,
  title: 'Test Movie',
  poster_path: null,
  overview: 'A movie about testing.',
  vote_average: 7.8,
  release_date: '2024-05-01',
  genre_ids: [28],
  popularity: 10,
}

describe('MovieCard', () => {
  it('renders the required poster, title, and rating in grid layout', () => {
    render(<MovieCard movie={movie} genresById={{ 28: 'Action' }} layout="grid" onSelect={vi.fn()} />)

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('7.8')).toBeInTheDocument()
    expect(screen.getByLabelText('No poster available for Test Movie')).toBeInTheDocument()
  })

  it('renders the same required fields in line layout', () => {
    render(<MovieCard movie={movie} genresById={{ 28: 'Action' }} layout="line" onSelect={vi.fn()} />)

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('7.8')).toBeInTheDocument()
  })

  it('calls onSelect with the movie when clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<MovieCard movie={movie} genresById={{ 28: 'Action' }} layout="grid" onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: /test movie/i }))

    expect(onSelect).toHaveBeenCalledWith(movie)
  })

  it('calls onSelect when activated with the Enter key', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<MovieCard movie={movie} genresById={{ 28: 'Action' }} layout="grid" onSelect={onSelect} />)

    screen.getByRole('button', { name: /test movie/i }).focus()
    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledWith(movie)
  })
})
