package org.gregb884.auth.service;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import org.springframework.stereotype.Service;

import java.net.URL;

@Service
public class AppleTokenVerifierService {


    private static final String APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys";
    private static final String APPLE_ISSUER = "https://appleid.apple.com";
    private static final String CLIENT_ID = "gregb884.TrainifyHub";

    public String verify(String idToken) throws Exception {

        URL jwkURL = new URL(APPLE_KEYS_URL);
        JWKSource<SecurityContext> keySource = new RemoteJWKSet<>(jwkURL);

        ConfigurableJWTProcessor<SecurityContext> jwtProcessor = new DefaultJWTProcessor<>();


        JWSKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(JWSAlgorithm.RS256, keySource);
        jwtProcessor.setJWSKeySelector(keySelector);

        JWTClaimsSet claimsSet = jwtProcessor.process(idToken, null);

        SignedJWT signedJWT = SignedJWT.parse(idToken);
        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
        String email = claims.getStringClaim("email");


        if (!claimsSet.getIssuer().equals(APPLE_ISSUER)) {
            throw new Exception("Invalid issuer " + claims.getIssuer());
        }

        if (!claimsSet.getAudience().contains(CLIENT_ID)) {
            throw new Exception("Invalid client id " + claims.getAudience());
        }

        return email;
    }




}
