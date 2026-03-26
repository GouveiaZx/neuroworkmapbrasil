"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Check, X, Loader2, Zap } from "lucide-react";
import { createTechnique, updateTechnique, deleteTechnique } from "./actions";

interface Technique {
  id: string;
  nome: string;
}

export default function TechniquesManager({
  techniques,
}: {
  techniques: Technique[];
}) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createTechnique(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setShowAdd(false);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await updateTechnique(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setEditingId(null);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const formData = new FormData();
    formData.set("id", id);
    await deleteTechnique(formData);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="animate-slide-up delay-400 rounded-2xl border border-neuro-100 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 font-semibold text-neuro-900">
          <Zap className="h-4 w-4 text-gold-500" />
          Técnicas ({techniques.length})
        </h2>
        {!showAdd && (
          <Button
            size="sm"
            onClick={() => { setShowAdd(true); setError(null); }}
            className="h-8 px-3 text-xs bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Nova
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <form action={handleCreate} className="mb-4 flex gap-2">
          <Input
            name="nome"
            placeholder="Nome da técnica..."
            autoFocus
            className="h-9 flex-1 rounded-lg border-neuro-200 text-sm"
          />
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="h-9 px-3 bg-neuro-600 text-white hover:bg-neuro-700"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => { setShowAdd(false); setError(null); }}
            className="h-9 px-3 text-neuro-400"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </form>
      )}

      {/* List */}
      <div className="space-y-2">
        {techniques.map((tech) => (
          <div key={tech.id}>
            {editingId === tech.id ? (
              /* Edit mode */
              <form action={handleUpdate} className="flex gap-2">
                <input type="hidden" name="id" value={tech.id} />
                <Input
                  name="nome"
                  defaultValue={tech.nome}
                  autoFocus
                  className="h-9 flex-1 rounded-lg border-neuro-200 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="h-9 px-3 bg-neuro-600 text-white hover:bg-neuro-700"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => { setEditingId(null); setError(null); }}
                  className="h-9 px-3 text-neuro-400"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </form>
            ) : (
              /* View mode */
              <div className="flex items-center justify-between rounded-xl border border-neuro-100 px-3 py-2.5 text-sm group hover:border-neuro-200 transition-colors">
                <span className="font-medium text-neuro-700 leading-tight">
                  {tech.nome}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingId(tech.id); setError(null); }}
                    className="rounded-md p-1.5 text-neuro-400 hover:text-neuro-700 hover:bg-neuro-50 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tech.id)}
                    disabled={deletingId === tech.id}
                    className="rounded-md p-1.5 text-neuro-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remover"
                  >
                    {deletingId === tech.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {techniques.length === 0 && (
        <p className="mt-2 text-center text-xs text-neuro-400">
          Nenhuma técnica cadastrada.
        </p>
      )}
    </div>
  );
}
