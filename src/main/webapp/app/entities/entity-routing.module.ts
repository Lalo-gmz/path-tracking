import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'learning-path',
        data: { pageTitle: 'l2EApp.learningPath.home.title' },
        loadChildren: () => import('./learning-path/learning-path.module').then(m => m.LearningPathModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'l2EApp.comment.home.title' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'l2EApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'status',
        data: { pageTitle: 'l2EApp.status.home.title' },
        loadChildren: () => import('./status/status.module').then(m => m.StatusModule),
      },
      {
        path: 'heart',
        data: { pageTitle: 'l2EApp.heart.home.title' },
        loadChildren: () => import('./heart/heart.module').then(m => m.HeartModule),
      },
      {
        path: 'dificulty',
        data: { pageTitle: 'l2EApp.dificulty.home.title' },
        loadChildren: () => import('./dificulty/dificulty.module').then(m => m.DificultyModule),
      },
      {
        path: 'level',
        data: { pageTitle: 'l2EApp.level.home.title' },
        loadChildren: () => import('./level/level.module').then(m => m.LevelModule),
      },
      {
        path: 'application-user',
        data: { pageTitle: 'l2EApp.applicationUser.home.title' },
        loadChildren: () => import('./application-user/application-user.module').then(m => m.ApplicationUserModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
