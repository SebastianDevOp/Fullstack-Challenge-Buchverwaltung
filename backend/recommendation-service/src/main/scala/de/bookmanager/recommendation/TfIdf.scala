package de.bookmanager.recommendation

def tokenize(text: String): List[String] = {
  text.toLowerCase
    .split("[^a-z0-9äöüß]+")
    .filter(_.nonEmpty)
    .toList
}

def tokenizeBook(book: ApiBook): List[String] = {
  val result = s"${book.title} ${book.author}"
  tokenize(result)
}

def berechneIDF(bücher: List[ApiBook]): Map[String, Double] = {
  bücher
    .flatMap(b => tokenizeBook(b).distinct)
    .groupBy(identity)
    .view
    .mapValues(_.size)
    .toMap
    .view
    .mapValues(vorkommen => math.log(bücher.size.toDouble / vorkommen))
    .toMap

}

def berechneVektor(
    buch: ApiBook,
    idf: Map[String, Double]
): Map[String, Double] = {

  tokenizeBook(buch)
    .groupBy(identity)
    .view
    .mapValues(_.size)
    .map((wort, anzahl) => wort -> anzahl * idf.getOrElse(wort, 0.0))
    .toMap
}

def kosinus(a: Map[String, Double], b: Map[String, Double]): Double = {
  val skalarprodukt =
    a.keySet
      .intersect(b.keySet)
      .toList
      .map(w => a(w) * b(w))
      .sum
  val längeA = math.sqrt(a.values.map(v => v * v).sum)
  val längeB = math.sqrt(b.values.map(v => v * v).sum)

  if längeA == 0 || längeB == 0 then 0.0
  else skalarprodukt / (längeA * längeB)
}
