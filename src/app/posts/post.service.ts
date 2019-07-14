import { Injectable, Component } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(p => {
          return {
            title: p.title,
            content: p.content,
            id: p._id,
            imagePath: p.imagePath
          };
        });
      }))
      .subscribe(
        (transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      }
      );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(postTitle: string, postContent: string, image: File) {

    const postData = new FormData();
    postData.append('title', postTitle);
    postData.append('content', postContent);
    postData.append('image', image, postTitle);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        const createdPost: Post = {
            id: res.post.id,
            title: postTitle,
            content: postContent,
            imagePath: res.post.imagePath
          };
        this.posts.push(createdPost);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  editPost(postId: string, postTitle: string, postContent: string, image: File | string) {
    let editPost: Post | FormData;
    if (typeof(image) === 'object') { // FIle type
      editPost = new FormData();
      editPost.append('id', postId);
      editPost.append('title', postTitle);
      editPost.append('content', postContent);
      editPost.append('image', image);
    } else {
      editPost = {
        id: postId,
        title: postTitle,
        content: postContent,
        imagePath: image
      };
    }
    this.http.put<{ message: string, newPostId: string }>('http://localhost:3000/api/posts/' + postId, editPost)
      .subscribe((res) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === postId);
        const post: Post = {
          id: postId,
          title: postTitle,
          content: postContent,
          imagePath: res['imagePath']
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe((res) => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostById(postId: string) {
    return this.http.get<{_id: string, title: string, content: any, imagePath: string }>('http://localhost:3000/api/posts/' + postId);
  }

}
