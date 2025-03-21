// src/store/slices/projectsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '@pages/projects/model/project';
import { projectService } from '@services/api/projectService';

interface ProjectsState {
    projects: Project[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

const initialState: ProjectsState = {
    projects: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
};

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async ({ page, size }: { page: number; size: number }) => {
        return await projectService.getProjects(page, size);
    },
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        return await projectService.createProject(projectData);
    },
);

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.content;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch projects';
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
            });
    },
});

export const { setCurrentPage, setPageSize } = projectsSlice.actions;
export default projectsSlice.reducer;
