import { db } from './config'
import { tables } from './consts'

export const insertMocks = async () => {
  const categoryCount = await db(tables.categories).count('* as count').first()
  const questionCount = await db(tables.questions).count('* as count').first()
  const answerCount = await db(tables.answers).count('* as count').first()

  if (categoryCount && categoryCount.count === 0) {
    const categoriesData = [{ name: 'Technologia' }, { name: 'Nauka' }, { name: 'Sztuka' }]
    await db(tables.categories).insert(categoriesData)
  }

  if (questionCount && questionCount.count === 0) {
    const categories = await db(tables.categories).select('*')

    const questionsData = [
      { content: 'Co to jest JavaScript?', category_id: categories[0].id }, // Technologia
      { content: 'Jakie są różnice między HTML a CSS?', category_id: categories[0].id },
      { content: 'Czym jest programowanie obiektowe?', category_id: categories[0].id },
      { content: 'Jak działa silnik JavaScript?', category_id: categories[0].id },
      { content: 'Co to jest framework?', category_id: categories[0].id },

      { content: 'Czym jest teoria względności?', category_id: categories[1].id }, // Nauka
      { content: 'Jakie są podstawowe zasady fizyki kwantowej?', category_id: categories[1].id },
      { content: 'Co to jest DNA?', category_id: categories[1].id },
      { content: 'Jak działa fotosynteza?', category_id: categories[1].id },
      { content: 'Czym jest czarna dziura?', category_id: categories[1].id },

      { content: 'Czym jest impresjonizm?', category_id: categories[2].id }, // Sztuka
      { content: 'Jakie są cechy sztuki nowoczesnej?', category_id: categories[2].id },
      { content: 'Kto jest autorem Mona Lisy?', category_id: categories[2].id },
      { content: 'Czym jest sztuka abstrakcyjna?', category_id: categories[2].id },
      { content: 'Jakie są różnice między rzeźbą a malarstwem?', category_id: categories[2].id }
    ]

    await db(tables.questions).insert(questionsData)
  }

  if (answerCount && answerCount.count === 0) {
    const questions = await db(tables.questions).select('*')

    const answersData = [
      // Odpowiedzi do pytania 1
      {
        content: 'JavaScript to język programowania.',
        note: null,
        question_id: questions[0].id,
        is_correct: true
      },
      {
        content: 'JavaScript to język znaczników.',
        note: null,
        question_id: questions[0].id,
        is_correct: false
      },
      {
        content: 'JavaScript to framework.',
        note: null,
        question_id: questions[0].id,
        is_correct: false
      },
      {
        content: 'JavaScript to biblioteka.',
        note: null,
        question_id: questions[0].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 2
      {
        content: 'HTML to język znaczników, a CSS to język stylów.',
        note: null,
        question_id: questions[1].id,
        is_correct: true
      },
      {
        content: 'HTML to język programowania.',
        note: null,
        question_id: questions[1].id,
        is_correct: false
      },
      {
        content: 'CSS to język baz danych.',
        note: null,
        question_id: questions[1].id,
        is_correct: false
      },
      {
        content: 'HTML i CSS to to samo.',
        note: null,
        question_id: questions[1].id,
        is_correct: false
      },

      // Opdowiedzi do pytania 3
      {
        content: 'Programowanie obiektowe to paradygmat programowania.',
        note: null,
        question_id: questions[2].id,
        is_correct: true
      },
      {
        content: 'Programowanie obiektowe to język programowania.',
        note: null,
        question_id: questions[2].id,
        is_correct: false
      },
      {
        content: 'Programowanie obiektowe to styl życia.',
        note: null,
        question_id: questions[2].id,
        is_correct: false
      },
      {
        content: 'Programowanie obiektowe to technika rysowania.',
        note: null,
        question_id: questions[2].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 4
      {
        content: 'Silnik JavaScript interpretuje kod.',
        note: null,
        question_id: questions[3].id,
        is_correct: true
      },
      {
        content: 'Silnik JavaScript kompiluje kod.',
        note: null,
        question_id: questions[3].id,
        is_correct: false
      },
      {
        content: 'Silnik JavaScript to program do rysowania.',
        note: null,
        question_id: questions[3].id,
        is_correct: false
      },
      {
        content: 'Silnik JavaScript to framework.',
        note: null,
        question_id: questions[3].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 5
      {
        content: 'Framework to zestaw narzędzi do budowy aplikacji.',
        note: null,
        question_id: questions[4].id,
        is_correct: true
      },
      {
        content: 'Framework to język programowania.',
        note: null,
        question_id: questions[4].id,
        is_correct: false
      },
      {
        content: 'Framework to biblioteka.',
        note: null,
        question_id: questions[4].id,
        is_correct: false
      },
      {
        content: 'Framework to system operacyjny.',
        note: null,
        question_id: questions[4].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 6
      {
        content: 'Teoria względności opisuje zjawiska w przestrzeni i czasie.',
        note: null,
        question_id: questions[5].id,
        is_correct: true
      },
      {
        content: 'Teoria względności to teoria chemiczna.',
        note: null,
        question_id: questions[5].id,
        is_correct: false
      },
      {
        content: 'Teoria względności dotyczy tylko grawitacji.',
        note: null,
        question_id: questions[5].id,
        is_correct: false
      },
      {
        content: 'Teoria względności to teoria biologiczna.',
        note: null,
        question_id: questions[5].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 7
      {
        content: 'Fizyka kwantowa bada zjawiska na poziomie atomowym.',
        note: null,
        question_id: questions[6].id,
        is_correct: true
      },
      {
        content: 'Fizyka kwantowa dotyczy tylko dużych obiektów.',
        note: null,
        question_id: questions[6].id,
        is_correct: false
      },
      {
        content: 'Fizyka kwantowa to teoria matematyczna.',
        note: null,
        question_id: questions[6].id,
        is_correct: false
      },
      {
        content: 'Fizyka kwantowa to nowa forma energii.',
        note: null,
        question_id: questions[6].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 8
      {
        content: 'DNA to nośnik informacji genetycznej.',
        note: null,
        question_id: questions[7].id,
        is_correct: true
      },
      {
        content: 'DNA to rodzaj białka.',
        note: null,
        question_id: questions[7].id,
        is_correct: false
      },
      {
        content: 'DNA to forma energii.',
        note: null,
        question_id: questions[7].id,
        is_correct: false
      },
      {
        content: 'DNA to rodzaj kwasu.',
        note: null,
        question_id: questions[7].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 9
      {
        content: 'Fotosynteza to proces, w którym rośliny przetwarzają światło na energię.',
        note: null,
        question_id: questions[8].id,
        is_correct: true
      },
      {
        content: 'Fotosynteza to proces oddychania.',
        note: null,
        question_id: questions[8].id,
        is_correct: false
      },
      {
        content: 'Fotosynteza to proces, w którym rośliny rosną.',
        note: null,
        question_id: questions[8].id,
        is_correct: false
      },
      {
        content: 'Fotosynteza to proces, w którym rośliny wytwarzają tlen.',
        note: null,
        question_id: questions[8].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 10
      {
        content:
          'Czarna dziura to obszar w przestrzeni, gdzie grawitacja jest tak silna, że nic nie może uciec.',
        note: null,
        question_id: questions[9].id,
        is_correct: true
      },
      {
        content: 'Czarna dziura to rodzaj gwiazdy.',
        note: null,
        question_id: questions[9].id,
        is_correct: false
      },
      {
        content: 'Czarna dziura to planeta.',
        note: null,
        question_id: questions[9].id,
        is_correct: false
      },
      {
        content: 'Czarna dziura to nowa forma energii.',
        note: null,
        question_id: questions[9].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 11
      {
        content:
          'Impresjonizm to ruch artystyczny, który koncentruje się na uchwyceniu chwilowych wrażeń.',
        note: null,
        question_id: questions[10].id,
        is_correct: true
      },
      {
        content: 'Impresjonizm to styl architektoniczny.',
        note: null,
        question_id: questions[10].id,
        is_correct: false
      },
      {
        content: 'Impresjonizm to forma muzyki.',
        note: null,
        question_id: questions[10].id,
        is_correct: false
      },
      {
        content: 'Impresjonizm to technika rysunkowa.',
        note: null,
        question_id: questions[10].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 12
      {
        content: 'Sztuka nowoczesna często łamie tradycyjne zasady.',
        note: null,
        question_id: questions[11].id,
        is_correct: true
      },
      {
        content: 'Sztuka nowoczesna to tylko malarstwo.',
        note: null,
        question_id: questions[11].id,
        is_correct: false
      },
      {
        content: 'Sztuka nowoczesna to styl muzyczny.',
        note: null,
        question_id: questions[11].id,
        is_correct: false
      },
      {
        content: 'Sztuka nowoczesna to forma literatury.',
        note: null,
        question_id: questions[11].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 13
      {
        content: 'Mona Lisa została namalowana przez Leonarda da Vinci.',
        note: null,
        question_id: questions[12].id,
        is_correct: true
      },
      {
        content: 'Mona Lisa to rzeźba.',
        note: null,
        question_id: questions[12].id,
        is_correct: false
      },
      {
        content: 'Mona Lisa to obraz namalowany przez Picassa.',
        note: null,
        question_id: questions[12].id,
        is_correct: false
      },
      {
        content: 'Mona Lisa to obraz stworzony w XX wieku.',
        note: null,
        question_id: questions[12].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 14
      {
        content: 'Sztuka abstrakcyjna nie przedstawia rzeczywistości w realistyczny sposób.',
        note: null,
        question_id: questions[13].id,
        is_correct: true
      },
      {
        content: 'Sztuka abstrakcyjna to tylko malarstwo.',
        note: null,
        question_id: questions[13].id,
        is_correct: false
      },
      {
        content: 'Sztuka abstrakcyjna to styl muzyczny.',
        note: null,
        question_id: questions[13].id,
        is_correct: false
      },
      {
        content: 'Sztuka abstrakcyjna to forma literatury.',
        note: null,
        question_id: questions[13].id,
        is_correct: false
      },

      // Odpowiedzi do pytania 15
      {
        content: 'Rzeźba to trójwymiarowa forma sztuki, podczas gdy malarstwo jest dwuwymiarowe.',
        note: null,
        question_id: questions[14].id,
        is_correct: true
      },
      {
        content: 'Rzeźba to forma muzyki.',
        note: null,
        question_id: questions[14].id,
        is_correct: false
      },
      {
        content: 'Rzeźba to technika malarska.',
        note: null,
        question_id: questions[14].id,
        is_correct: false
      },
      {
        content: 'Rzeźba to forma literatury.',
        note: null,
        question_id: questions[14].id,
        is_correct: false
      }
    ]

    await db(tables.answers).insert(answersData)
  }
}
