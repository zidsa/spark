export interface ExampleItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

export interface CreateExamplePayload {
  title: string;
  description: string;
  email: string;
}
