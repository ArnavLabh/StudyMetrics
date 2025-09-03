#!/usr/bin/env python3
"""
StudyMetrics Analytics Generator
Generates advanced analytics charts using matplotlib for IITM BS students
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import json
import sys
import os
from datetime import datetime, timedelta
import seaborn as sns

# Set style for professional charts
plt.style.use('dark_background')
sns.set_palette("husl")

class StudyMetricsAnalytics:
    def __init__(self, user_data):
        self.user_data = user_data
        self.courses = user_data.get('courses', {})
        self.electives = user_data.get('electives', [])
        self.cgpa_history = user_data.get('cgpaHistory', [])
        
        # Grade scale
        self.grade_scale = {'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 4}
        
        # Course structure
        self.course_structure = {
            'foundation': {'total_credits': 32, 'courses': 8},
            'programming': {'total_credits': 27, 'courses': 8},
            'dataScience': {'total_credits': 27, 'courses': 8},
            'degreeCore': {'total_credits': 20, 'courses': 5},
            'electives': {'total_credits': 36, 'courses': 9}
        }
    
    def calculate_section_stats(self):
        """Calculate statistics for each section"""
        sections = {
            'foundation': {'completed': 0, 'total_credits': 0, 'grade_points': 0},
            'programming': {'completed': 0, 'total_credits': 0, 'grade_points': 0},
            'dataScience': {'completed': 0, 'total_credits': 0, 'grade_points': 0},
            'degreeCore': {'completed': 0, 'total_credits': 0, 'grade_points': 0},
            'electives': {'completed': 0, 'total_credits': 0, 'grade_points': 0}
        }
        
        for course_id, data in self.courses.items():
            if data.get('grade'):
                section = course_id.split('-')[0]
                if section in sections:
                    grade = data['grade']
                    credits = self.get_course_credits(course_id)
                    
                    sections[section]['completed'] += 1
                    sections[section]['total_credits'] += credits
                    sections[section]['grade_points'] += self.grade_scale[grade] * credits
        
        # Calculate CGPAs
        for section_data in sections.values():
            if section_data['total_credits'] > 0:
                section_data['cgpa'] = section_data['grade_points'] / section_data['total_credits']
            else:
                section_data['cgpa'] = 0
        
        return sections
    
    def get_course_credits(self, course_id):
        """Get credits for a course based on its ID"""
        section, index = course_id.split('-', 1)
        
        # Default credits mapping
        credit_map = {
            'foundation': 4,
            'programming': 4,
            'dataScience': 4,
            'degreeCore': 4,
            'elective': 4
        }
        
        # Special cases for programming diploma
        if section == 'programming':
            if index in ['3', '6']:  # Project courses
                return 2
            elif index == '7':  # System Commands
                return 3
        
        # Special cases for data science diploma
        elif section == 'dataScience':
            if 'project' in index:
                return 2
            elif index == '5':  # Tools in Data Science
                return 3
        
        return credit_map.get(section, 4)
    
    def generate_section_performance_radar(self, output_path):
        """Generate radar chart showing performance across sections"""
        sections = self.calculate_section_stats()
        
        # Prepare data
        section_names = ['Foundation', 'Programming', 'Data Science', 'Degree Core', 'Electives']
        cgpas = [sections[key]['cgpa'] for key in ['foundation', 'programming', 'dataScience', 'degreeCore', 'electives']]
        
        # Create radar chart
        fig, ax = plt.subplots(figsize=(10, 8), subplot_kw=dict(projection='polar'))
        
        # Calculate angles for each section
        angles = np.linspace(0, 2 * np.pi, len(section_names), endpoint=False).tolist()
        angles += angles[:1]  # Complete the circle
        cgpas += cgpas[:1]  # Complete the circle
        
        # Plot
        ax.plot(angles, cgpas, 'o-', linewidth=3, label='Your Performance', color='#00ff88')
        ax.fill(angles, cgpas, alpha=0.25, color='#00ff88')
        
        # Add target line (8.0 CGPA)
        target_line = [8.0] * len(angles)
        ax.plot(angles, target_line, '--', linewidth=2, label='Target (8.0)', color='#ff6b6b', alpha=0.7)
        
        # Customize
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(section_names, fontsize=12)
        ax.set_ylim(0, 10)
        ax.set_yticks([2, 4, 6, 8, 10])
        ax.set_yticklabels(['2', '4', '6', '8', '10'], fontsize=10)
        ax.grid(True, alpha=0.3)
        
        plt.title('Section-wise Academic Performance', fontsize=16, fontweight='bold', pad=20)
        plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='#0c1220')
        plt.close()
    
    def generate_credit_progress_sunburst(self, output_path):
        """Generate sunburst chart showing credit completion progress"""
        sections = self.calculate_section_stats()
        
        fig, ax = plt.subplots(figsize=(12, 10))
        
        # Data for sunburst
        section_data = []
        colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6']
        
        for i, (key, name) in enumerate([
            ('foundation', 'Foundation'),
            ('programming', 'Programming'),
            ('dataScience', 'Data Science'),
            ('degreeCore', 'Degree Core'),
            ('electives', 'Electives')
        ]):
            completed = sections[key]['total_credits']
            total = self.course_structure[key]['total_credits']
            remaining = total - completed
            
            section_data.append({
                'name': name,
                'completed': completed,
                'remaining': remaining,
                'total': total,
                'color': colors[i]
            })
        
        # Create nested pie charts
        # Outer ring - sections
        outer_sizes = [data['total'] for data in section_data]
        outer_colors = [data['color'] for data in section_data]
        outer_labels = [f"{data['name']}\n{data['total']} credits" for data in section_data]
        
        # Inner ring - completion status
        inner_sizes = []
        inner_colors = []
        for data in section_data:
            inner_sizes.extend([data['completed'], data['remaining']])
            inner_colors.extend([data['color'], '#2d3748'])
        
        # Plot outer ring
        wedges1, texts1, autotexts1 = ax.pie(outer_sizes, labels=outer_labels, colors=outer_colors,
                                           radius=1, startangle=90, labeldistance=1.1,
                                           textprops={'fontsize': 10, 'fontweight': 'bold'})
        
        # Plot inner ring
        wedges2, texts2 = ax.pie(inner_sizes, colors=inner_colors, radius=0.7, startangle=90)[:2]
        
        # Add center text
        total_completed = sum(sections[key]['total_credits'] for key in sections.keys())
        completion_percentage = (total_completed / 142) * 100
        
        ax.text(0, 0, f'{total_completed}/142\nCredits\n{completion_percentage:.1f}%', 
                ha='center', va='center', fontsize=16, fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.5', facecolor='#1a202c', alpha=0.8))
        
        plt.title('Credit Completion Progress', fontsize=18, fontweight='bold', pad=20)
        plt.axis('equal')
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='#0c1220')
        plt.close()
    
    def generate_grade_improvement_timeline(self, output_path):
        """Generate timeline showing grade improvement opportunities"""
        if not self.cgpa_history:
            # Create a placeholder chart
            fig, ax = plt.subplots(figsize=(12, 8))
            ax.text(0.5, 0.5, 'No CGPA history available yet.\nStart adding grades to see your progress!',
                   ha='center', va='center', fontsize=16, transform=ax.transAxes,
                   bbox=dict(boxstyle='round,pad=1', facecolor='#1a202c', alpha=0.8))
            ax.set_xlim(0, 1)
            ax.set_ylim(0, 1)
            ax.axis('off')
            plt.title('CGPA Progress Timeline', fontsize=18, fontweight='bold', pad=20)
            plt.tight_layout()
            plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='#0c1220')
            plt.close()
            return
        
        # Sort history by timestamp
        history = sorted(self.cgpa_history, key=lambda x: x['timestamp'])
        
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10), height_ratios=[2, 1])
        
        # Extract data
        dates = [datetime.fromisoformat(entry['timestamp'].replace('Z', '+00:00')) for entry in history]
        cgpas = [float(entry['cgpa']) for entry in history]
        credits = [int(entry['credits']) for entry in history]
        
        # Plot CGPA trend
        ax1.plot(dates, cgpas, 'o-', linewidth=3, markersize=8, color='#00ff88', label='CGPA')
        ax1.fill_between(dates, cgpas, alpha=0.3, color='#00ff88')
        
        # Add target lines
        ax1.axhline(y=8.0, color='#ff6b6b', linestyle='--', alpha=0.7, label='Good (8.0)')
        ax1.axhline(y=9.0, color='#ffd93d', linestyle='--', alpha=0.7, label='Excellent (9.0)')
        
        # Annotations for significant changes
        for i in range(1, len(cgpas)):
            change = cgpas[i] - cgpas[i-1]
            if abs(change) > 0.1:  # Significant change
                color = '#00ff88' if change > 0 else '#ff6b6b'
                ax1.annotate(f'{change:+.2f}', 
                           xy=(dates[i], cgpas[i]), 
                           xytext=(10, 10), textcoords='offset points',
                           bbox=dict(boxstyle='round,pad=0.3', facecolor=color, alpha=0.7),
                           fontsize=10, fontweight='bold')
        
        ax1.set_ylabel('CGPA', fontsize=12, fontweight='bold')
        ax1.set_title('CGPA Progress Over Time', fontsize=16, fontweight='bold')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        ax1.set_ylim(max(0, min(cgpas) - 0.5), min(10, max(cgpas) + 0.5))
        
        # Plot credit accumulation
        ax2.bar(dates, credits, color='#3b82f6', alpha=0.7, label='Credits Completed')
        ax2.set_ylabel('Credits', fontsize=12, fontweight='bold')
        ax2.set_xlabel('Date', fontsize=12, fontweight='bold')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # Format x-axis
        fig.autofmt_xdate()
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='#0c1220')
        plt.close()
    
    def generate_performance_heatmap(self, output_path):
        """Generate heatmap showing performance patterns"""
        # Create a matrix of performance data
        sections = ['Foundation', 'Programming', 'Data Science', 'Degree Core', 'Electives']
        metrics = ['Completion %', 'CGPA', 'Credits']
        
        section_stats = self.calculate_section_stats()
        
        # Prepare data matrix
        data_matrix = []
        for key in ['foundation', 'programming', 'dataScience', 'degreeCore', 'electives']:
            stats = section_stats[key]
            total_possible = self.course_structure[key]['total_credits']
            completion_pct = (stats['total_credits'] / total_possible) * 100
            
            row = [
                completion_pct,
                stats['cgpa'],
                stats['total_credits']
            ]
            data_matrix.append(row)
        
        # Normalize data for heatmap (0-1 scale)
        normalized_data = np.array(data_matrix)
        for j in range(normalized_data.shape[1]):
            col_max = normalized_data[:, j].max()
            if col_max > 0:
                normalized_data[:, j] = normalized_data[:, j] / col_max
        
        fig, ax = plt.subplots(figsize=(10, 8))
        
        # Create heatmap
        im = ax.imshow(normalized_data, cmap='RdYlGn', aspect='auto', vmin=0, vmax=1)
        
        # Set ticks and labels
        ax.set_xticks(np.arange(len(metrics)))
        ax.set_yticks(np.arange(len(sections)))
        ax.set_xticklabels(metrics, fontsize=12)
        ax.set_yticklabels(sections, fontsize=12)
        
        # Add text annotations
        for i in range(len(sections)):
            for j in range(len(metrics)):
                if j == 0:  # Completion %
                    text = f'{data_matrix[i][j]:.1f}%'
                elif j == 1:  # CGPA
                    text = f'{data_matrix[i][j]:.2f}'
                else:  # Credits
                    text = f'{int(data_matrix[i][j])}'
                
                ax.text(j, i, text, ha='center', va='center', 
                       fontweight='bold', fontsize=11,
                       color='white' if normalized_data[i, j] < 0.5 else 'black')
        
        # Add colorbar
        cbar = plt.colorbar(im, ax=ax, shrink=0.8)
        cbar.set_label('Performance Score (Normalized)', fontsize=12, fontweight='bold')
        
        plt.title('Academic Performance Heatmap', fontsize=16, fontweight='bold', pad=20)
        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='#0c1220')
        plt.close()
    
    def generate_all_charts(self, output_dir):
        """Generate all analytics charts"""
        os.makedirs(output_dir, exist_ok=True)
        
        charts = [
            ('section_performance_radar.png', self.generate_section_performance_radar),
            ('credit_progress_sunburst.png', self.generate_credit_progress_sunburst),
            ('grade_improvement_timeline.png', self.generate_grade_improvement_timeline),
            ('performance_heatmap.png', self.generate_performance_heatmap)
        ]
        
        generated_files = []
        for filename, generator_func in charts:
            try:
                output_path = os.path.join(output_dir, filename)
                generator_func(output_path)
                generated_files.append(filename)
                print(f"Generated: {filename}")
            except Exception as e:
                print(f"Error generating {filename}: {str(e)}")
        
        return generated_files

def main():
    if len(sys.argv) < 2:
        print("Usage: python analytics_generator.py <user_data_json>")
        sys.exit(1)
    
    try:
        # Parse user data from command line argument
        user_data_json = sys.argv[1]
        user_data = json.loads(user_data_json)
        
        # Create analytics generator
        analytics = StudyMetricsAnalytics(user_data)
        
        # Generate charts
        output_dir = os.path.join(os.path.dirname(__file__), 'generated_charts')
        generated_files = analytics.generate_all_charts(output_dir)
        
        # Return success response
        result = {
            'success': True,
            'generated_files': generated_files,
            'output_directory': output_dir
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == '__main__':
    main()