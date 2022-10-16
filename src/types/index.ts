export type User = {
  accessToken?: string | null | undefined
  displayName: string | null | undefined
  email: string | null | undefined
  emailVerified: boolean | null | undefined
  isAnonymous?: boolean | null | undefined
  photoNumber?: string | null | undefined
  photoURL?: string | null | undefined
  proactiveRefresh?: null | undefined
  providerData?: [] | null | undefined
  providerId?: string | null | undefined
  uid: string | null | undefined
  refreshToken?: string | null | undefined
}

export type Login = {
  type?: 'google' | 'email'
  name?: string
  surname?: string
  email: string
  password: string
}

export interface Movie {
  adult: boolean | null
  backdrop_path: string
  genre_ids: number[] | string[] | Array<number | string> | null
  id: number | null
  original_language: string | null
  original_title: string | null
  overview: string
  popularity: number | null
  poster_path: string
  release_date: string | null
  title: string
  video: boolean | null
  vote_average: number | null
  vote_count: number | null
}

export type Genre = {
  id: number
  name: string
}

export interface GenreWithMovies extends Genre {
  movies: Movie[]
}

// export type  = [
//   // action: {
//   //   id: 28
//   //   movies: Movie[]
//   // },
//   // adventure: {
//   //   id: 12
//   //   movies: Movie[]
//   // },
//   // animation: {
//   //   id: 16
//   //   movies: Movie[]
//   // },
//   // comedy: {
//   //   id: 35
//   //   movies: Movie[]
//   // },
//   // crime: {
//   //   id: 80
//   //   movies: Movie[]
//   // },
//   // documentary: {
//   //   id: 99
//   //   movies: Movie[]
//   // },
//   // drama: {
//   //   id: 18
//   //   movies: Movie[]
//   // },
//   // family: {
//   //   id: 10751
//   //   movies: Movie[]
//   // },
//   // fantasy: {
//   //   id: 14
//   //   movies: Movie[]
//   // },
//   // history: {
//   //   id: 36
//   //   movies: Movie[]
//   // },
//   // horror: {
//   //   id: 27
//   //   movies: Movie[]
//   // },
//   // music: {
//   //   id: 10402
//   //   movies: Movie[]
//   // },
//   // mystery: {
//   //   id: 9648
//   //   movies: Movie[]
//   // },
//   // romance: {
//   //   id: 10749
//   //   movies: Movie[]
//   // },
//   // scienceFiction: {
//   //   id: 878
//   //   movies: Movie[]
//   // },
//   // tvMovie: {
//   //   id: 10770
//   //   movies: Movie[]
//   // },
//   // thriller: {
//   //   id: 53
//   //   movies: Movie[]
//   // },
//   // war: {
//   //   id: 10752
//   //   movies: Movie[]
//   // },
//   // western: {
//   //   id: 37
//   //   movies: Movie[]
//   // }
// ]

export type Theme = Record<string, never>

export interface Profile {
  id: number
  displayName: string
  theme: Theme | string
  photo: string
  kidsProfile: boolean
  favoriteMovies: Movie[] | null
  favoriteGenres: Genre[] | null
}
