-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX authors_normalized_name_unique
  ON authors (replace(replace(lower(name), '.', ''), ' ', ''));