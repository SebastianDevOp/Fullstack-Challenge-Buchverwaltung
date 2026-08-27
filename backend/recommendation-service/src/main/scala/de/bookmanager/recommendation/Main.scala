package de.bookmanager.recommendation

import org.apache.pekko.actor.typed.ActorSystem
import org.apache.pekko.actor.typed.scaladsl.Behaviors
import org.apache.pekko.http.scaladsl.Http
import org.apache.pekko.http.scaladsl.marshallers.sprayjson.SprayJsonSupport.*
import org.apache.pekko.http.scaladsl.model.StatusCodes
import org.apache.pekko.http.scaladsl.server.Directives.*
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import scala.io.StdIn
import JsonFormats.{*, given}

@main def run(): Unit = {

  given system: ActorSystem[Nothing] = ActorSystem(Behaviors.empty, "Name")

  given ExecutionContext = system.executionContext

  val response: Future[ApiBookPage] = BooksClient.ladeBuecher()

  response.foreach(seite => println(s"${seite.total} Bücher geholt"))

  response.failed.foreach(e => println(s"Fehler: ${e.getMessage}"))

  val route = path("recommendations") {
    get {
      onSuccess(response) { seite =>
        complete(BookTitle(seite.data.map(_.title)))
      }
    }
  } ~
    path("recommendations" / IntNumber) { id =>
      get {
        onSuccess(response) { seite =>
          seite.data.find(_.id == id) match
            case Some(buch) =>
              val idf = berechneIDF(seite.data)
              val zielVektor = berechneVektor(buch, idf)
              complete(
                (RecommendationResponse(
                  seite.data
                    .filter(_.id != id)
                    .map(b =>
                      Recommendation(
                        b.title,
                        kosinus(zielVektor, berechneVektor(b, idf))
                      )
                    )
                    .sortBy(-_.similarity)
                    .take(5)
                ))
              )
            case None => complete(StatusCodes.NotFound)

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
