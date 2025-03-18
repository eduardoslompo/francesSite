
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '@/types/quiz';
import { addCategory, updateCategory } from '@/lib/quizService';

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess, onCancel }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [level, setLevel] = useState<'basico' | 'medio' | 'expert'>(
    category?.level || 'basico'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getLevelClass = (level: string) => {
    switch (level) {
      case 'basico':
        return 'level-basico';
      case 'medio':
        return 'level-medio';
      case 'expert':
        return 'level-expert';
      default:
        return 'level-basico';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const categoryData = {
        name,
        description,
        level,
        levelClass: getLevelClass(level),
        questionsCount: category?.questionsCount || 0,
      };
      
      if (category?.id) {
        await updateCategory(category.id, categoryData);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await addCategory(categoryData);
        toast.success('Categoria criada com sucesso!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error('Ocorreu um erro ao salvar a categoria.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-french-dark mb-1">
          Nome da Categoria *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent"
          placeholder="Ex: Vocabulário Básico"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-french-dark mb-1">
          Descrição *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent"
          placeholder="Descreva brevemente esta categoria..."
          rows={3}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-french-dark mb-1">
          Nível de Dificuldade *
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="level"
              value="basico"
              checked={level === 'basico'}
              onChange={() => setLevel('basico')}
              className="mr-2"
            />
            <span className="text-french-gray">Básico</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="level"
              value="medio"
              checked={level === 'medio'}
              onChange={() => setLevel('medio')}
              className="mr-2"
            />
            <span className="text-french-gray">Médio</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="level"
              value="expert"
              checked={level === 'expert'}
              onChange={() => setLevel('expert')}
              className="mr-2"
            />
            <span className="text-french-gray">Expert</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-french-gray hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          className="bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : category?.id ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
