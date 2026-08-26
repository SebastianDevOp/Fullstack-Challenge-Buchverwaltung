package de.bookmanager.recommendation

import org.apache.pekko.actor.typed.ActorSystem
import org.apache.pekko.http.scaladsl.server.Directives.*
import org.apache.pekko.actor.typed.scaladsl.Behaviors
import org.apache.pekko.http.scaladsl.Http
import spray.json.DefaultJsonProtocol
import spray.json.RootJsonFormat
import scala.io.StdIn
import scala.concurrent.ExecutionContext
import org.apache.pekko.http.scaladsl.model.HttpRequest
import scala.concurrent.Future
import org.apache.pekko.http.scaladsl.model.HttpResponse
import org.apache.pekko.http.scaladsl.unmarshalling.Unmarshal
import org.apache.pekko.http.scaladsl.marshallers.sprayjson.SprayJsonSupport.*
import JsonFormats.{*, given}
import org.apache.pekko.http.scaladsl.server.Route

object JsonFormats extends DefaultJsonProtocol {
  given RootJsonFormat[ApiBook] = jsonFormat6(ApiBook.apply)
  given RootJsonFormat[ApiBookPage] = jsonFormat4(ApiBookPage.apply)
  given RootJsonFormat[Recommendations] = jsonFormat1(
    Recommendations.apply
  )

}

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

case class Recommendations(
    titles: List[String]
)

@main def run(): Unit = {

  given system: ActorSystem[Nothing] = ActorSystem(Behaviors.empty, "Name")

  given ExecutionContext = system.executionContext

  val apiBase = sys.env.getOrElse("BOOKS_API_URL", "http://localhost:8080")

  val response: Future[ApiBookPage] =
    Http()
      .singleRequest(HttpRequest(uri = apiBase + "/api/books?size=100"))
      .flatMap(antwort => Unmarshal(antwort).to[ApiBookPage])

  response.foreach(seite => println(s"${seite.total} Bücher geholt"))

  response.failed.foreach(e => println(s"Fehler: ${e.getMessage}"))

  val route = path("recommendations") {
    get {
      onSuccess(response) { seite =>
        complete(Recommendations(seite.data.map(_.title)))
      }
    }
  }

  val binding = Http().newServerAt("0.0.0.0", 8081).bind(route)

  binding.foreach(b => println(s" läuft auf ${b.localAddress}"))
  binding.failed.foreach(e =>
    println(s"Serverstart fehlgeschlagen: ${e.getMessage}")
  )

  StdIn.readLine()
}
