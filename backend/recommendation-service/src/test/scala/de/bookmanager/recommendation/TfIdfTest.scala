package de.bookmanager.recommendation

class TfIdfTest extends munit.FunSuite {

  def buch(title: String) = ApiBook(1, title, None, None, 1, "")

  test("zerlegt an Satzzeichen, macht klein") {
    val expected: List[String] =
      List("faust", "der", "tragödie", "erster", "teil")
    assertEquals(tokenize("Faust. Der Tragödie erster Teil"), expected)
  }

  test("Umlaute bleiben ganz") {
    val expected: List[String] = List("die", "höhle", "des", "löwen")
    assertEquals(tokenize("Die Höhle des Löwen"), expected)
  }

  test("führendes Trennzeichen erzeugt keinen leeren Eintrag") {
    val expected: List[String] = List("die", "letzte", "warnung")
    assertEquals(tokenize(" Die letzte Warnung"), expected)
  }

  test("häufiges Wort bekommt kleineres Gewicht") {
    val bücher: List[ApiBook] =
      List(
        buch("der herr der ringe"),
        buch("der steppenwolf"),
        buch("algorithms")
      )

    val idf = berechneIDF(bücher)
    assert(
      idf("der") < idf("algorithms"),
      s"der=${idf("der")} algorithms=${idf("algorithms")}"
    )
    assert(idf("der") > 0.0, s"der=${idf("der")} darf nicht auf 0 fallen")
  }

  test("doppeltes Wort bekommt doppeltes Gewicht") {
    val bücher = List(buch("der herr der ringe"), buch("der steppenwolf"))
    val idf = berechneIDF(bücher)
    val vektor = berechneVektor(buch("der herr der ringe"), idf)

    assertEqualsDouble(
      vektor("der"),
      2 * idf("der"),
      0.0001,
      s"der=${vektor("der")} idf=${idf("der")}"
    )
  }

  test("identische Vektoren sind maximal aehnlich") {
    val bücher = List(buch("der herr der ringe"), buch("der steppenwolf"))
    val idf = berechneIDF(bücher)
    val vektor = berechneVektor(buch("der herr der ringe"), idf)

    assertEqualsDouble(kosinus(vektor, vektor), 1.0, 0.0001)
  }

  test("ohne gemeinsame Woerter ist die Aehnlichkeit null") {
    val bücher = List(buch("der herr der ringe"), buch("algorithms"))
    val idf = berechneIDF(bücher)
    val a = berechneVektor(buch("der herr der ringe"), idf)
    val b = berechneVektor(buch("algorithms"), idf)

    assertEqualsDouble(kosinus(a, b), 0.0, 0.0001)
  }
}

// tokenize	zerlegt an Satzzeichen, macht klein
// tokenize	Umlaute bleiben ganz — "Höhlen" darf nicht zerfallen
// tokenize	führendes Trennzeichen erzeugt keinen leeren Eintrag
// berechneIDF	häufiges Wort bekommt kleineres Gewicht als seltenes
// berechneVektor	doppeltes Wort bekommt doppeltes Gewicht
// kosinus	identische Vektoren → 1.0
// kosinus	ohne gemeinsame Wörter → 0.0
