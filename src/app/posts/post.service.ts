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
  private postsUpdated = new Subject<{posts: Post[], count: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, count: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(p => {
            return {
              title: p.title,
              content: p.content,
              id: p._id,
              imagePath: p.imagePath
            };
          }), count: postData.count
        };
      }))
      .subscribe(
        (transformedPostData) => {
          this.posts = transformedPostData.posts;
          this.postsUpdated.next({posts: [...this.posts], count: transformedPostData.count});
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
        this.router.navigate(['/']);
      });
  }

  editPost(postId: string, postTitle: string, postContent: string, image: File | string) {
    let editPost: Post | FormData;
    if (typeof (image) === 'object') { // FIle type
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
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }

  getPostById(postId: string) {
    return this.http.get<{ _id: string, title: string, content: any, imagePath: string }>('http://localhost:3000/api/posts/' + postId);
  }

}
