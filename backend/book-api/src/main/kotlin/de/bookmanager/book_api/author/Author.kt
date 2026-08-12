package de.bookmanager.book_api.author

import jakarta.persistence.*

@Entity
@Table(name = "authors")
class Author(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int? = null,
        @Column(nullable = false) var name: String,
)
