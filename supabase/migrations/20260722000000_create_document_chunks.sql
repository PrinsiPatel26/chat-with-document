create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_name text not null,
  chunk_index integer not null,
  chunk_text text not null,
  embedding_model text not null,
  embedding vector(768) not null,
  created_at timestamptz not null default now(),
  unique (document_name, chunk_index)
);

create index if not exists document_chunks_document_name_idx
  on public.document_chunks (document_name);

create index if not exists document_chunks_embedding_idx
  on public.document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);