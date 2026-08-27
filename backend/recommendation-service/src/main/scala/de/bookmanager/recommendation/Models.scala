package de.bookmanager.recommendation

import spray.json.DefaultJsonProtocol
import spray.json.RootJsonFormat

case class ApiBook(
    id: Int,
    title: String,
    isbn: Option[String],
    year: Option[Int],
    authorId: Int,
    author: String
)

case class ApiBookPage(
    data: List[ApiBook],
    page: Int,
    pageSize: Int,
    total: Long
)

case class BookTitle(
    titles: List[String]
)

case class Recommendation(
    title: String,
    similarity: Double
)

case class RecommendationResponse(data: List[Recommendation])

object JsonFormats extends DefaultJsonProtocol {
  given RootJsonFormat[ApiBook] = jsonFormat6(ApiBook.apply)
  given RootJsonFormat[ApiBookPage] = jsonFormat4(ApiBookPage.apply)
  given RootJsonFormat[BookTitle] = jsonFormat1(BookTitle.apply)
  given RootJsonFormat[Recommendation] = jsonFormat2(Recommendation.apply)
  given RootJsonFormat[RecommendationResponse] = jsonFormat1(
    RecommendationResponse.apply
  )

}
