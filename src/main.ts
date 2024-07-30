async function main() {
  try {
    console.log('Hello, world!')
  } catch (error: unknown | Error) {
    if (error instanceof Error) {
      console.error('An error occurred:', error.message)
    } else {
      console.error('An unknown error occurred:', error)
    }
  }
}

main()
