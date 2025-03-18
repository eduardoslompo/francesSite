
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Question, Category } from '@/types/quiz';
import { addQuestion, updateQuestion, getCategories } from '@/lib/quizService';
import { Plus, Trash2 } from 'lucide-react';

interface QuestionFormProps {
  question?: Question;
  onSuccess: () => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSuccess, onCancel }) => {
  const [text, setText] = useState(question?.text || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(question?.correctAnswer || 0);
  const [category, setCategory] = useState(question?.category || '');
  const [difficulty, setDifficulty] = useState<'basico' | 'medio' | 'expert'>(
    question?.difficulty || 'basico'
  );
  const [explanation, setExplanation] = useState(question?.explanation || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
        
        // Se não houver categoria selecionada e existirem categorias, selecione a primeira
        if (!category && data.length > 0) {
          setCategory(data[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        toast.error('Não foi possível carregar as categorias.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [category]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    } else {
      toast.error('Máximo de 6 opções permitidas.');
    }
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast.error('A questão precisa ter pelo menos 2 opções.');
      return;
    }
    
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    
    // Ajustar a resposta correta se necessário
    if (correctAnswer >= newOptions.length) {
      setCorrectAnswer(0);
    } else if (correctAnswer === index) {
      setCorrectAnswer(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!text.trim()) {
      toast.error('A pergunta não pode estar em branco.');
      return;
    }
    
    if (!category) {
      toast.error('Selecione uma categoria para a questão.');
      return;
    }
    
    if (options.some(option => !option.trim())) {
      toast.error('Todas as opções devem ser preenchidas.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const questionData = {
        text,
        options,
        correctAnswer,
        category,
        difficulty,
        explanation: explanation.trim() || undefined,
      };
      
      if (question?.id) {
        await updateQuestion(question.id, questionData);
        toast.success('Questão atualizada com sucesso!');
      } else {
        await addQuestion(questionData);
        toast.success('Questão criada com sucesso!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar questão:', error);
      toast.error('Ocorreu um erro ao salvar a questão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-french-dark mb-1">
          Pergunta *
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent"
          placeholder="Digite a pergunta aqui..."
          rows={3}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-french-dark mb-3">
          Opções de Resposta *
        </label>
        
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={correctAnswer === index}
                onChange={() => setCorrectAnswer(index)}
                className="mr-2"
              />
              
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent"
                placeholder={`Opção ${index + 1}`}
                required
              />
              
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-red-500 hover:text-red-700"
                title="Remover opção"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addOption}
            className="flex items-center text-french-blue hover:text-french-lightBlue font-medium"
          >
            <Plus size={18} className="mr-1" />
            Adicionar opção
          </button>
          
          <p className="text-sm text-french-gray mt-2">
            * Selecione o botão à esquerda da opção correta.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-french-dark mb-1">
            Categoria *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent"
            required
          >
            <option value="" disabled>Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-french-dark mb-1">
            Nível de Dificuldade *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                value="basico"
                checked={difficulty === 'basico'}
                onChange={() => setDifficulty('basico')}
                className="mr-2"
              />
              <span className="text-french-gray">Básico</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                value="medio"
                checked={difficulty === 'medio'}
                onChange={() => setDifficulty('medio')}
                className="mr-2"
              />
              <span className="text-french-gray">Médio</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                value="expert"
                checked={difficulty === 'expert'}
                onChange={() => setDifficulty('expert')}
                className="mr-2"
              />
              <span className="text-french-gray">Expert</span>
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="explanation" className="block text-sm font-medium text-french-dark mb-1">
          Explicação (opcional)
        </label>
        <textarea
          id="explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent"
          placeholder="Explicação sobre a resposta correta..."
          rows={3}
        />
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
          {isSubmitting ? 'Salvando...' : question?.id ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
