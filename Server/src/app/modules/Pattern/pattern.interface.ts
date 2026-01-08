export interface TPatternFeatures {
    shapeType: 'spiral' | 'angular' | 'flowing' | 'geometric' | 'chaotic' | 'organic';
    colorMood: 'warm' | 'cool' | 'vibrant' | 'muted' | 'monochrome';
    lineQuality: 'smooth' | 'jagged' | 'continuous' | 'broken';
    density: number; // 0-1
    symmetry: number; // 0-1
}

export interface TUserPattern {
    userId: string;
    imageUrl: string;
    emotion: string;
    intensity: number; // 0-1
    tags: string[];
    colorPalette: string[];
    features?: TPatternFeatures;
    embedding?: number[]; // For similarity search
    createdAt?: Date;
    updatedAt?: Date;
}
