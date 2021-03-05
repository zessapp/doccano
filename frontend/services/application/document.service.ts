import { DocumentItem, DocumentItemList } from '@/models/document'
import { DocumentItemRepository, SearchOption } from '@/repositories/document/interface'

export class DocumentDTO {
  id                : number
  text              : string
  meta              : string
  annotationApprover: boolean | null
  commentCount      : number

  constructor(item: DocumentItem) {
    this.id = item.id
    this.text = item.text
    this.meta = item.meta
    this.annotationApprover = item.annotationApprover
    this.commentCount = item.commentCount
  }
}

export class DocumentListDTO {
  count: number
  next : string | null
  prev : string | null
  items: DocumentDTO[]

  constructor(item: DocumentItemList) {
    this.count = item.count
    this.next = item.next
    this.prev = item.prev
    this.items = item.items.map(_ => new DocumentDTO(_))
  }
}


export class DocumentApplicationService {
  constructor(
    private readonly repository: DocumentItemRepository
  ) {}

  public async list(projectId: string, options: SearchOption): Promise<DocumentListDTO> {
    try {
      const item = await this.repository.list(projectId, options)
      return new DocumentListDTO(item)
    } catch(e) {
      throw new Error(e.response.data.detail)
    }
  }

  public async create(projectId: string, item: DocumentDTO): Promise<DocumentDTO> {
    try {
      const doc = this.toModel(item)
      const response = await this.repository.create(projectId, doc)
      return new DocumentDTO(response)
    } catch(e) {
      throw new Error(e.response.data.detail)
    }
  }

  public async update(projectId: string, item: DocumentDTO): Promise<void> {
    try {
      const doc = this.toModel(item)
      await this.repository.update(projectId, doc)
    } catch(e) {
      throw new Error(e.response.data.detail)
    }
  }

  public bulkDelete(projectId: string, items: DocumentDTO[]): Promise<void> {
    const ids = items.map(item => item.id)
    return this.repository.bulkDelete(projectId, ids)
  }

  private toModel(item: DocumentDTO): DocumentItem {
    return new DocumentItem(
      item.id,
      item.text,
      item.meta,
      item.annotationApprover,
      item.commentCount
    )
  }
}
