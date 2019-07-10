import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postSubs: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts();

    this.postSubs =  this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    if (this.postSubs) {
      this.postSubs.unsubscribe();
    }
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId);
  }

  onEditPost(postId: string) {

  }

}
