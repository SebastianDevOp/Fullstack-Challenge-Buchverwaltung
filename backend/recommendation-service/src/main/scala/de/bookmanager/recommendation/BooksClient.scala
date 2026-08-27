package de.bookmanager.recommendation

import org.apache.pekko.actor.typed.ActorSystem
import org.apache.pekko.http.scaladsl.Http
import org.apache.pekko.http.scaladsl.marshallers.sprayjson.SprayJsonSupport.*
import org.apache.pekko.http.scaladsl.model.HttpRequest
import org.apache.pekko.http.scaladsl.unmarshalling.Unmarshal
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import JsonFormats.{*, given}

object BooksClient {

  private val apiBase =
    sys.env.getOrElse("BOOKS_API_URL", "http://localhost:8080")

  def ladeBuecher()(using
      system: ActorSystem[Nothing],
      ec: ExecutionContext
  ): Future[ApiBookPage] =
    Http()
      .singleRequest(HttpRequest(uri = apiBase + "/api/books?size=100"))
      .flatMap(antwort => Unmarshal(antwort).to[ApiBookPage])
}
