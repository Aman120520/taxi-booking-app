package com.junnoexpress

import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import kotlin.io.encoding.Base64


class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
    printHashKey(this)
  }

  fun printHashKey(pContext: Context) {
    try {
      val info =
        pContext.packageManager.getPackageInfo(pContext.packageName, PackageManager.GET_SIGNATURES)
      for (signature in info.signatures) {
        val md = MessageDigest.getInstance("SHA")
        md.update(signature.toByteArray())
        val hashKey: String = String(android.util.Base64.encode(md.digest(), 0))
        Log.i("TAG", "printHashKey() Hash Key: $hashKey")
      }
    } catch (e: NoSuchAlgorithmException) {
      Log.e("TAG", "printHashKey()", e)
    } catch (e: Exception) {
      Log.e("TAG", "printHashKey()", e)
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "JunnoExpress"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
