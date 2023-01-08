import documents from '@assets/documents'
import images from '@assets/images'
import videos from '@assets/videos'

class Assets {
  public load (): void {
    documents.load()
    images.load()
    videos.load()
  }
}

export default new Assets()
