import { type IRequestProperties } from './types'

const DEFAULT_ERROR_MESSAGE = 'Erro Interno, tente novamente mais tarde!'

class FetcherError extends Error {
  constructor(
    public request: IRequestProperties,
    public response: Response,
    public body: any
  ) {
    super()
    // eslint-disable-next-line no-console
    console.error('* Fetch Error', {
      request,
      status: response.status,
      body,
    })
    this.message = this.handleErrorMessage()
  }

  handleErrorMessage() {
    if (this.response.status === 404) {
      return 'Conteudo não encontrado!'
    }

    if (!this.body) {
      return DEFAULT_ERROR_MESSAGE
    }

    if (typeof this.body === 'string') {
      return this.body
    }

    if (this.body && typeof this.body === 'object') {
      if (this.body?.error && typeof this.body.error === 'string') {
        return this.body.error
      }
      if (this.body?.message && typeof this.body.message === 'string') {
        return this.body.error
      }
    }

    return DEFAULT_ERROR_MESSAGE
  }
}

export default FetcherError
