import { Situation } from '@/pages/SituationsPage';
import { SituationDetail } from '@/pages/SituationDetailPage';

// Function to get all situations for the main listing page
export const getAllSituations = async (): Promise<Situation[]> => {
  try {
    // This will hold all our situations
    const situations: Situation[] = [];
    
    // Import all JSON files from the situations directory
    const situationModules = import.meta.glob('../data/situations/*.json', { eager: true });
    
    // Process each situation file
    for (const path in situationModules) {
      // Skip the README file if it's somehow included
      if (path.includes('README')) continue;
      
      const situationData = situationModules[path] as any;
      
      // Add the basic situation data needed for the listing
      situations.push({
        id: getSituationIdFromPath(path),
        title: situationData.title,
        description: situationData.description,
        image: situationData.image,
        examples: situationData.examples || []
      });
    }
    
    return situations;
  } catch (error) {
    console.error('Error loading situations:', error);
    return [];
  }
};

// Function to get a specific situation by ID
export const getSituationById = async (situationId: string): Promise<SituationDetail | null> => {
  try {
    // Dynamically import the specific situation file
    const situationModule = await import(`../data/situations/${situationId}.json`);
    return situationModule.default || situationModule;
  } catch (error) {
    console.error(`Error loading situation ${situationId}:`, error);
    return null;
  }
};

// Helper function to extract situation ID from file path
function getSituationIdFromPath(path: string): string {
  // Extract filename without extension
  const filename = path.split('/').pop() || '';
  return filename.replace('.json', '');
}