class Documents {
  private readonly totalLoadCount = 0
  private currentLoadCount = 0

  public load (): void {
    // TODO: load images
  }

  private add (filename: string): void {
    this.currentLoadCount++
    console.log(`(${this.currentLoadCount}/${this.totalLoadCount}) Loading document asset... ${filename}`)
  }
}

export default new Documents()
