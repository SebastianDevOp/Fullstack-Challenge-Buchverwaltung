name := "recommendation-service"

version := "1.0.0"

scalaVersion := "3.3.6"

libraryDependencies ++= Seq( 
"org.apache.pekko" %% "pekko-http"        % "1.3.0",
"org.apache.pekko" %% "pekko-actor-typed" % "1.6.0",
"org.apache.pekko" %% "pekko-stream"      % "1.6.0")
assembly / assemblyJarName := "recommendation-service.jar"
