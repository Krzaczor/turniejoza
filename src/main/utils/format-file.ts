export const formatFile = (file: string) => {
  const questions: any[] = []
  const lines = file
    .trim()
    .split('\n')
    .filter((line) => line.trim())

  const questionBlocks = getSegments(lines, 5)

  for (const block of questionBlocks) {
    const answer1 = formatAnswerContent(block[1])
    const answer2 = formatAnswerContent(block[2])
    const answer3 = formatAnswerContent(block[3])
    const answer4 = formatAnswerContent(block[4])

    questions.push({
      content: block[0].slice(1).trim(),
      answers: [
        {
          content: answer1.content,
          note: answer1.note,
          is_correct: true
        },
        {
          content: answer2.content,
          note: answer2.note,
          is_correct: false
        },
        {
          content: answer3.content,
          note: answer3.note,
          is_correct: false
        },
        {
          content: answer4.content,
          note: answer4.note,
          is_correct: false
        }
      ]
    })
  }

  return questions
}

function getSegments<T>(array: T[], segmentLength: number) {
  const segments: T[][] = []

  for (let i = 0; i < array.length; i += segmentLength) {
    const segment = array.slice(i, i + segmentLength)
    segments.push(segment)
  }

  return segments
}

const formatAnswerContent = (text: string) => {
  const [beforeBrackets, insideBrackets = null] = text.split('[')

  const content = beforeBrackets.trim()
  const note = insideBrackets && insideBrackets.replace(']', '').trim()

  return { content, note } as const
}
