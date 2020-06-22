If building for android returns some gradle error -> add:

org.gradle.daemon=false
file.encoding=utf-8

to platforms/android/gradle.properties
