package de.bookmanager.recommendation

import org.apache.pekko.actor.typed.ActorSystem
import org.apache.pekko.http.scaladsl.server.Directives.*
import org.apache.pekko.actor.typed.scaladsl.Behaviors
import org.apache.pekko.http.scaladsl.Http
import scala.io.StdIn

@main def run(): Unit = {

  given system: ActorSystem[Nothing] = ActorSystem(Behaviors.empty, "Name")

  val route = path("recommendations") {
    get {
      complete("Success")
    }
  }

  Http().newServerAt("0.0.0.0", 8081).bind(route)

  println("läuft auf 8081")

  StdIn.readLine()
}
