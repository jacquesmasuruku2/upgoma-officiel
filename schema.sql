-- 1. Ajout de la colonne author si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='author') THEN
        ALTER TABLE public.news ADD COLUMN author TEXT;
    END IF;
END $$;

-- 2. Mise à jour des anciennes lignes avec un auteur par défaut
UPDATE public.news SET author = 'Admin UPG' WHERE author IS NULL;

-- 3. Rendre le champ obligatoire pour les futures insertions
ALTER TABLE public.news ALTER COLUMN author SET NOT NULL;
